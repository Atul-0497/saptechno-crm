"use client";

export default function CompanyTable({
  data,
  loading,
  onEdit,
  onDelete,
  onInlineUpdate,
  onToggleActive,
}: any) {
  if (loading) return <p>Loading...</p>;

  return (
    <table className="w-full border text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.filter((c: any) => c.Active === true)
          .map((c: any) => (
            <tr key={c.CompanyId}>
              <td>{c.CompanyId}</td>

              <td
                onClick={() =>
                  onInlineUpdate({
                    ...c,
                    Name: prompt("Edit Name", c.Name),
                  })
                }
              >
                {c.Name}
              </td>

              <td>{c.Email}</td>

              <td>
                <button onClick={() => onToggleActive(c)}>
                  {String(c.Active) === "1" ? "Active" : "Inactive"}
                </button>
              </td>

              <td>
                <button onClick={() => onEdit(c)}>Edit</button>
                <button onClick={() => onDelete(c.CompanyId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}