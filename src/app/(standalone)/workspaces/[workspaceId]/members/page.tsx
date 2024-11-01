import { MembersList } from "@/features/members/components/members-list";

const MembersPage = async () => {
    return (
        <div className="w-full lg:max-w-xl">
            <MembersList />
        </div>
    );
};

export default MembersPage;