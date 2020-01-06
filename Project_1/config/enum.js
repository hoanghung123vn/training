'use strict';

const Enum = {
    StreamType: {
        AudioOnly: 0,
        VideoOnly: 1,
        AudioAndVideo: 2
    },
    Permission:{
        UserManagement : 1,
        UpdatePermissionMember : 2,
        RoleManagement : 3,
        MemberManagement : 4,
        Post : 5,
        ZoneManagement: 6,
        Tag: 7
    }
};

module.exports = Enum;