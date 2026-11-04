type Props = {
  fullName: string | null;
  role: string;
  shopName: string | null;
  onLogout: () => void;
};

const managerSections = [
  "Sales & Checkout",
  "Inventory (edit products and prices)",
  "Credit & Debt (delete entries)",
  "Reports",
  "Staff (add and remove employees)",
];

const employeeSections = [
  "Sales & Checkout",
  "Inventory (view only)",
  "Credit & Debt (record payments)",
];

export default function Dashboard({ fullName, role, shopName, onLogout }: Props) {
  const sections = role === "manager" ? managerSections : employeeSections;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {fullName}</h1>
          <p className="text-gray-600">
            {shopName} · {role}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="rounded bg-gray-900 px-4 py-2 text-white"
        >
          Log out
        </button>
      </header>

      <ul className="grid gap-3">
        {sections.map((section) => (
          <li key={section} className="rounded border p-4">
            {section}
          </li>
        ))}
      </ul>
    </main>
  );
}