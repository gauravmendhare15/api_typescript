import * as groupInterfaces from "../interface/group";
import { Group, GroupSubscribe } from "../models/group";
import { SOCKETEVENT } from "../utils/const";
import UserCollection from "./userCollection";


class GroupCollection {
    groupInfo: any = {}

    getGroupInfo(groupId: any): groupInterfaces.socketGroup {
        return this.groupInfo[groupId]
    }

    setGroupInfo(groupInfo: groupInterfaces.socketGroup) {
        if (this.groupInfo[groupInfo._id] === undefined)
            this.groupInfo[groupInfo._id] = groupInfo
    }
    async initializeGroup(): Promise<any> {
        try {
            let groupObj = this
            let groups = await Group.find();

            //initialize all groups
            for (let i = 0; i < groups.length; i++) {
                const element = groups[i];
                let allMembers = await GroupSubscribe.find({ gId: element._id, })
                let admins = allMembers.filter((element) => element.role == 1).map(x => x.mId.toString());
                let members = allMembers.filter((element) => element.role == 2).map(x => x.mId.toString());
                let obj = {
                    _id: element._id,
                    name: element.name,
                    admins: admins,
                    members: members,
                    onlineUser: []
                }
                groupObj.setGroupInfo(obj)
            }
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    addUserInGroup(userId: any, groupId: any) {
        try {
            let groupObj = this.groupInfo[groupId]
            if (groupObj.onlineUser.indexOf(userId) === -1) this.groupInfo[groupId].onlineUser.push(userId.toString());
            return true;
        } catch (error) {
            console.log(error);
        }
    }
    async addSubscriber(groupId: any, adminId: any, mId: any, role = SOCKETEVENT.GROUP_MEMBER) {
        if (Array.isArray(mId)) {
            for (let i = 0; i < mId.length; i++) {
                const element = mId[i];

                let alreadySubscribed = await GroupSubscribe.findOne({ gId: groupId, mId: element })
                if (!alreadySubscribed) {
                    let subGroup = new GroupSubscribe()
                    subGroup.gId = groupId
                    subGroup.mId = element
                    subGroup.addedBy = adminId
                    subGroup.role = role

                    await subGroup.save()
                    //initialize to groupcollection 
                    this.addUserInGroup(element, groupId)
                }
            }
        }
        else {
            let alreadySubscribed = await GroupSubscribe.findOne({ gId: groupId, mId: mId })
            if (!alreadySubscribed) {
                let subGroup = new GroupSubscribe()
                subGroup.gId = groupId
                subGroup.mId = mId
                subGroup.addedBy = adminId
                subGroup.role = role

                await subGroup.save()
                //initialize to groupcollection 
                this.addUserInGroup(mId, groupId)
            }
        }

    }
}


export default new GroupCollection();