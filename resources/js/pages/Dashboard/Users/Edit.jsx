import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';
import UserForm from '../../../Components/Dashboard/UserForm';

export default function Edit({ managedUser, roles }) {
    return (
        <DashboardLayout title="Edit user">
            <PageHeader eyebrow="Admin only" title={`Edit ${managedUser.name}`} description="Update account details, role or password." />
            <UserForm managedUser={managedUser} roles={roles} />
        </DashboardLayout>
    );
}
