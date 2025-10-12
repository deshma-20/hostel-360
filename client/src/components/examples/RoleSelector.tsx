import RoleSelector from '../RoleSelector';

export default function RoleSelectorExample() {
  const handleRoleSelect = (role: string) => {
    console.log('Role selected:', role);
  };

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
}
