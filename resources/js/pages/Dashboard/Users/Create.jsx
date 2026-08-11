import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';
import UserForm from '../../../Components/Dashboard/UserForm';

export default function Create({ roles }) {
    return (
        <DashboardLayout title="Add user">
            <PageHeader eyebrow="Admin only" title="Create a user" description="Add an administrator or team member to the secure workspace." />
            <UserForm roles={roles} />
        </DashboardLayout>
    );
}
