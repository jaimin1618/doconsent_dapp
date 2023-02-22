// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract Consent {
    address public owner;
    uint256 USER_DATA_INDEXER = 0;
    uint256 USER_DATA_REQUEST_INDEXER = 0;

    struct UserDataRequest {
        uint256 request_id;
        uint256 requested_data_id;
        string requested_data_name;
        address request_from; // msg_sender
        address request_to;
        bool isVerificationCompleted;
        RequestStatus request_status;
        uint256 created_datetime;
        uint256 approved_datetime;
    }

    // User owns this
    struct UserData {
        uint256 id;
        address data_owner;
        string data_name; // "health care", "personal", ...
        string data_cid; // IPFS cid
        DataVerificationStage verification_stage;
        IssuerVerificationStatus issuer_verification_status;
        uint256 created_datetime;
        uint256 last_updated_datetime;
    }

    // User defined data strcutures
    enum Role {
        HOLDER,
        ISSUER,
        VERIFIER
    }

    enum IssuerVerificationStatus {
        PENDING,
        DATA_VERIFICATION_ACCEPTED,
        DATA_VERIFICATION_REJECTED
    }

    enum DataVerificationStage {
        INFO_SIGNED_BY_HOLDER,
        INFO_SIGNED_BY_ISSUER
    }

    enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    // All Users Personal Data in Dynamic array
    UserData[] all_users_data;
    // Requests are NOT deleted from contract, NOT consider IPFS for this as of now
    UserDataRequest[] requests;
    address[] issuerAdmins;

    mapping(address => uint256[]) user_data; // "ADDAB1265..." owns [1, 3, 7]
    mapping(address => Role) user_role; // User => Role mapping
    mapping(uint256 => address[]) consent; // UserData.id => allowed users address
    mapping(address => uint256[]) userHasConsentOf; // address => DataIndxes with consent allowed
    mapping(address => uint256[]) user_requests;
    mapping(address => uint256[]) requestMadeByAddress;

    constructor() {
        owner = msg.sender;
        user_role[owner] = Role.ISSUER;
    }

    modifier isAdmin() {
        require(msg.sender == owner, "Only ADMIN can perform this");
        _;
    }

    modifier isIssuer() {
        address addr = msg.sender;
        require(
            user_role[addr] == Role.ISSUER,
            "Only Issuer (User) can run this utility"
        );
        _;
    }

    modifier isUserDataOwner(uint256 data_id) {
        address user_address = msg.sender;
        bool isOwner = false;

        uint256[] memory v = user_data[user_address];
        for (uint256 k = 0; k < v.length; ++k) {
            if (v[k] == data_id) {
                isOwner = true;
                break;
            }
        }

        require(isOwner, "User doesn't have enough permission");
        _;
    }

    error UserDataNotFound(uint256 user_data_id);

    function makeIssuer(address issuer_address) external isAdmin {
        require(
            user_role[issuer_address] != Role.ISSUER,
            "This public address is already an issuer"
        );
        issuerAdmins.push(issuer_address);
        user_role[issuer_address] = Role.ISSUER;
    }


    error IssuerNotFound(address);
    function removeIssuer(address issuer_address) external isAdmin {
        require(
            user_role[issuer_address] == Role.ISSUER,
            "This public address is NOT issuer, cannot be removed from ISSUER role"
        );

        uint256 len = issuerAdmins.length;
        bool isIssuerFound = false;
        for (uint256 k = 0; k < len; ++k) {
            if (issuerAdmins[k] == issuer_address) {
                issuerAdmins[k] = issuerAdmins[len - 1];
                isIssuerFound = true;
            }
        }
        if(!isIssuerFound) revert IssuerNotFound(issuer_address);
        issuerAdmins.pop();
        user_role[issuer_address] = Role.HOLDER;
    }

    function getIssuerAdmins()
        external
        view
        isAdmin
        returns (address[] memory issuer_admins)
    {
        return issuerAdmins;
    }

    function isUserIssuer(address user_address)
        public
        view
        returns (bool is_issuer)
    {
        return user_role[user_address] == Role.ISSUER;
    }

    function isRequestMadeByIssuer(uint256 request_id)
        external
        view
        returns (bool is_issuer)
    {
        uint256 len = requests.length;
        address request_from;
        bool flag = false;

        for (uint256 i = 0; i < len; ++i) {
            if (requests[i].request_id == request_id) {
                flag = true;
                request_from = requests[i].request_from;
                break;
            }
        }

        return isUserIssuer(request_from);
    }

    function getSenderUserDataIndexes()
        external
        view
        returns (uint256[] memory user_data_indexes)
    {
        address user_address = msg.sender;
        return user_data[user_address];
    }

    function getIndexForDataVerificationStage(DataVerificationStage input)
        internal
        pure
        returns (int256)
    {
        int256 result = -1;
        if (input == DataVerificationStage.INFO_SIGNED_BY_HOLDER) {
            result = 0;
        } else if (input == DataVerificationStage.INFO_SIGNED_BY_ISSUER) {
            result = 1;
        }

        return result;
    }

    function getIndexForIssuerVerificationStatus(IssuerVerificationStatus input)
        internal
        pure
        returns (int256)
    {
        int256 result = -1;
        if (input == IssuerVerificationStatus.PENDING) {
            result = 0;
        } else if (
            input == IssuerVerificationStatus.DATA_VERIFICATION_ACCEPTED
        ) {
            result = 1;
        } else if (
            input == IssuerVerificationStatus.DATA_VERIFICATION_REJECTED
        ) {
            result = 2;
        }

        return result;
    }

    error NotEnoughPermission(address user_address, uint256 data_id);

    function readUserData(uint256 data_id)
        external
        view
        returns (
            uint256 user_data_id,
            string memory user_data_name,
            string memory user_data_cid,
            int256 data_verification_stage,
            int256 issuer_verification_status
        )
    {
        bool hasReadPermission = false;

        // check user owns that data_id
        uint256[] memory v = user_data[msg.sender];
        for (uint256 i = 0; i < v.length; ++i) {
            if (v[i] == data_id) {
                hasReadPermission = true;
                break;
            }
        }

        // check has permission for that data
        address[] memory c = consent[data_id];
        for (uint256 j = 0; j < c.length; ++j) {
            if (c[j] == msg.sender) {
                hasReadPermission = true;
                break;
            }
        }

        if (!hasReadPermission) revert NotEnoughPermission(msg.sender, data_id);

        UserData memory u_data;
        for (uint256 i = 0; i < all_users_data.length; ++i) {
            if (all_users_data[i].id == data_id) {
                // found it
                u_data = all_users_data[i];
            }
        }

        return (
            u_data.id,
            u_data.data_name,
            u_data.data_cid,
            getIndexForDataVerificationStage(u_data.verification_stage),
            getIndexForIssuerVerificationStatus(
                u_data.issuer_verification_status
            )
        );
    }

    function addUserData(string memory data_name, string memory data_cid)
        external
    {
        require(
            user_role[msg.sender] != Role.ISSUER,
            "Issuer Cannot data as User"
        );

        user_role[msg.sender] = Role.HOLDER;
        uint256 id = USER_DATA_INDEXER;
        USER_DATA_INDEXER++;
        UserData memory u_data = UserData(
            id,
            msg.sender,
            data_name,
            data_cid,
            DataVerificationStage.INFO_SIGNED_BY_HOLDER,
            IssuerVerificationStatus.PENDING,
            block.timestamp,
            block.timestamp
        );
        all_users_data.push(u_data);
        user_data[msg.sender].push(id);
    }

    // this function is used by issuer to change verification status 1,2
    error PermissionNotFound(uint256 data_id, address user_address);
    error RequestNotFound(uint256 request_id);

    function issuerVerification(uint256 request_id, uint256 status)
        external
        isIssuer
    {
        // 0 => PENDING, 1 => ACCEPTED, 2 => REJECTED
        require(status >= 0 && status < 3, "Invalid STATUS code");
        IssuerVerificationStatus ivs = IssuerVerificationStatus.PENDING;
        DataVerificationStage dvs = DataVerificationStage.INFO_SIGNED_BY_ISSUER;

        uint256 user_data_id;
        bool isRequestFound = false;
        for (uint256 k = 0; k < requests.length; ++k) {
            if (request_id == requests[k].request_id) {
                user_data_id = requests[k].requested_data_id;
                requests[k].isVerificationCompleted = true;
                isRequestFound = true;
            }
        }

        if (!isRequestFound) revert RequestNotFound(request_id);

        if (status == 1) {
            ivs = IssuerVerificationStatus.DATA_VERIFICATION_ACCEPTED;
        } else if (status == 2) {
            ivs = IssuerVerificationStatus.DATA_VERIFICATION_REJECTED;
        }

        for (uint256 i = 0; i < all_users_data.length; ++i) {
            if (all_users_data[i].id == user_data_id) {
                // found that user_data
                all_users_data[i].issuer_verification_status = ivs;
                all_users_data[i].last_updated_datetime = block.timestamp;

                if (status == 1 || status == 2) {
                    all_users_data[i].verification_stage = dvs;
                }
            }
        }

        // remove isser's permission after data is verified by issuer
        bool flag = false;
        uint256 len = consent[user_data_id].length;

        for (uint256 j = 0; j < len; ++j) {
            if (consent[user_data_id][j] == msg.sender) {
                flag = true;
                consent[user_data_id][j] = consent[user_data_id][len - 1];
            }
        }

        if (!flag) revert PermissionNotFound(user_data_id, msg.sender);
        consent[user_data_id].pop();

        // remove issuer's permission on address => id[]
        flag = false;
        len = userHasConsentOf[msg.sender].length;

        for (uint256 j = 0; j < len; ++j) {
            if (userHasConsentOf[msg.sender][j] == user_data_id) {
                flag = true;
                userHasConsentOf[msg.sender][j] = userHasConsentOf[msg.sender][
                    len - 1
                ];
            }
        }

        if (!flag) revert PermissionNotFound(user_data_id, msg.sender);
        userHasConsentOf[msg.sender].pop();
    }

    function removeUserData(uint256 data_id) external {
        uint256 length = user_data[msg.sender].length;
        bool isOwnershipRemoved = false;

        for (uint256 j = 0; j < length; ++j) {
            if (user_data[msg.sender][j] == data_id) {
                isOwnershipRemoved = true;
                user_data[msg.sender][j] = user_data[msg.sender][length - 1];
            }
        }

        if (!isOwnershipRemoved) revert UserDataNotFound(data_id);
        user_data[msg.sender].pop();

        length = all_users_data.length;
        bool isDataIdFound = false;

        // deleting from all_users_data record
        for (uint256 i = 0; i < length; ++i) {
            if (all_users_data[i].id == data_id) {
                isDataIdFound = true;
                all_users_data[i] = all_users_data[length - 1];
            }
        }

        if (!isDataIdFound) revert UserDataNotFound(data_id);
        all_users_data.pop();
    }

    function updateUserData(
        uint256 data_id,
        string memory new_data_name,
        string memory new_data_cid
    ) external {
        address user_address = msg.sender;
        uint256 length = all_users_data.length;

        // check user owns it
        bool flag = false;
        uint256[] memory v = user_data[user_address];
        for (uint256 k = 0; k < v.length; ++k) {
            if (v[k] == data_id) {
                flag = true;
                break;
            }
        }

        if (!flag) revert UserDataNotFound(data_id);

        for (uint256 i = 0; i < length; ++i) {
            if (all_users_data[i].id == data_id) {
                all_users_data[i].data_name = new_data_name;
                all_users_data[i].data_cid = new_data_cid;
                all_users_data[i].last_updated_datetime = block.timestamp;
            }
        }
    }

    function getUserRequest()
        external
        view
        returns (uint256[] memory current_user_requests)
    {
        uint256[] memory v = requestMadeByAddress[msg.sender];
        return v;
    }

    function getUserDataById(uint256 user_data_id)
        internal
        view
        returns (UserData memory data)
    {
        uint256 len = all_users_data.length;
        for (uint256 i = 0; i < len; ++i) {
            if (all_users_data[i].id == user_data_id) {
                return all_users_data[i];
            }
        }
    }

    error InvalidRequestID(uint256 request_id);

    function getRequestById(uint256 request_id)
        external
        view
        returns (UserDataRequest memory request)
    {
        uint256 len = requests.length;
        for (uint256 i = 0; i < len; ++i) {
            if (requests[i].request_id == request_id) {
                // only request_from and request_to can view (see) this request
                if (
                    msg.sender == requests[i].request_from ||
                    msg.sender == requests[i].request_to
                ) {
                    return requests[i];
                } else {
                    revert InvalidRequestID(request_id);
                }
            }
        }
    }

    function getRequestIndexesForCurrentUser()
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory v = user_requests[msg.sender];
        return v;
    }

    function makeRequest(uint256 requested_data_id) external {
        // NOT_DONE: Throw error when requested_data_id is already deleted
        uint256 id = USER_DATA_REQUEST_INDEXER;
        USER_DATA_REQUEST_INDEXER++;
        UserData memory u_data = getUserDataById(requested_data_id);
        UserDataRequest memory req = UserDataRequest(
            id,
            u_data.id,
            u_data.data_name,
            msg.sender,
            u_data.data_owner,
            false,
            RequestStatus.PENDING,
            block.timestamp,
            0
        );
        requests.push(req);
        user_requests[u_data.data_owner].push(id);
        requestMadeByAddress[msg.sender].push(id);
    }

    error ThisRequestWasNotMadeToCurrentUser(
        uint256 requested_data_id,
        address current_user
    );

    function fulfillRequest(uint256 request_id, uint256 status) external {
        uint256 len = requests.length;
        // status REJECTED => 0, ACCEPTED => 1
        require(
            status == 0 || status == 1,
            "Invalid status number, it must be 0 or 1"
        );

        bool flag = false;

        for (uint256 i = 0; i < len; ++i) {
            if (requests[i].request_id == request_id) {
                if (requests[i].request_to != msg.sender) {
                    revert ThisRequestWasNotMadeToCurrentUser(
                        request_id,
                        msg.sender
                    );
                } else {
                    // giving issuer permission to view data
                    consent[requests[i].requested_data_id].push(
                        requests[i].request_from
                    );
                    userHasConsentOf[requests[i].request_from].push(
                        requests[i].requested_data_id
                    );
                    // make data verification stage PENDING

                    len = all_users_data.length;
                    for (uint256 k = 0; k < len; ++k) {
                        if (
                            all_users_data[k].id ==
                            requests[i].requested_data_id
                        ) {
                            all_users_data[k]
                                .issuer_verification_status = IssuerVerificationStatus
                                .PENDING;

                            flag = true;
                            // requests[i].isCompleted = true;
                            requests[i].approved_datetime = block.timestamp;
                            requests[i].request_status = (
                                status == 1
                                    ? RequestStatus.ACCEPTED
                                    : RequestStatus.REJECTED
                            );
                        }
                    }
                    break;
                }
            }
        }

        if (!flag) {
            revert RequestNotFound(request_id);
        }
    }

    function getUserConsentDataIndexes()
        external
        view
        returns (uint256[] memory data_indexes)
    {
        return userHasConsentOf[msg.sender];
    }

    function give_consent(uint256 data_id, address recipient_address)
        external
        isUserDataOwner(data_id)
    {
        // give consent to recipient
        bool flag = check_consent(data_id, recipient_address);
        if (!flag) {
            consent[data_id].push(recipient_address);
            userHasConsentOf[recipient_address].push(data_id);
        }
    }

    function revoke_consent(uint256 data_id, address recipient_address)
        external
        isUserDataOwner(data_id)
    {
        bool flag = check_consent(data_id, recipient_address);
        if (flag) {
            uint256 len = consent[data_id].length;
            bool found = false;

            // revoke from ID => address[] mapping
            for (uint256 i = 0; i < len; ++i) {
                if (consent[data_id][i] == recipient_address) {
                    // found it
                    found = true;
                    consent[data_id][i] = consent[data_id][len - 1];
                    break;
                }
            }
            if (found) consent[data_id].pop();

            // revoke from address => id[]
            len = userHasConsentOf[recipient_address].length;
            found = false;

            for (uint256 j = 0; j < len; ++j) {
                if (userHasConsentOf[recipient_address][j] == data_id) {
                    found = true;
                    userHasConsentOf[recipient_address][j] = userHasConsentOf[
                        recipient_address
                    ][len - 1];
                    break;
                }
            }
            if (found) userHasConsentOf[recipient_address].pop();
        }
    }

    function check_consent(uint256 data_id, address recipient_address)
        public
        view
        returns (bool status)
    {
        uint256 len = consent[data_id].length;
        bool flag = false;
        for (uint256 i = 0; i < len; ++i) {
            if (consent[data_id][i] == recipient_address) {
                flag = true;
                break;
            }
        }

        return flag;
    }

    function getApprovedConsentsForData(uint256 data_id)
        external
        view
        returns (address[] memory consent_give_to)
    {
        // check user is owner
        uint256 len = user_data[msg.sender].length;

        bool flag = false;
        for (uint256 i = 0; i < len; ++i) {
            if (user_data[msg.sender][i] == data_id) {
                flag = true;
                break;
            }
        }

        if (!flag) revert NotEnoughPermission(msg.sender, data_id);
        return consent[data_id];
    }
}
