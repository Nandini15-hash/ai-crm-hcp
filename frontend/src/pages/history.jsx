import { useEffect, useState } from "react";
import api from "../services/api";

function History() {
  const [interactions, setInteractions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInteractions();
  }, []);

  const loadInteractions = () => {
    api
      .get("/interactions")
      .then((res) => {
        setInteractions(res.data);
      })
      .catch((err) => console.error(err));
  };

  const deleteInteraction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interaction?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/interaction/${id}`);
      alert("Interaction deleted successfully.");
      loadInteractions();
    } catch (err) {
      console.error(err);
      alert("Unable to delete interaction.");
    }
  };

  const editInteraction = async (item) => {
    const notes = prompt("Update Notes", item.notes);

    if (notes === null) return;

    try {
      await api.put("/interaction", {
        interaction_id: item.id,
        updates: {
          notes: notes,
        },
      });

      alert("Interaction updated successfully.");
      loadInteractions();
    } catch (err) {
      console.error(err);
      alert("Unable to update interaction.");
    }
  };

  const filtered = interactions.filter((item) =>
    item.hcp_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Interaction History</h2>

      <input
        type="text"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          margin: "20px 0",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#2563eb", color: "white" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Doctor</th>
            <th style={{ padding: "10px" }}>Type</th>
            <th style={{ padding: "10px" }}>Topics</th>
            <th style={{ padding: "10px" }}>Notes</th>
            <th style={{ padding: "10px" }}>Follow-up</th>
            <th style={{ padding: "10px" }}>Edit</th>
            <th style={{ padding: "10px" }}>Delete</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No interactions found.
              </td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.id}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.hcp_name}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.interaction_type}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.topics}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.notes}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {item.follow_up}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <button
                    onClick={() => editInteraction(item)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </td>

                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <button
                    onClick={() => deleteInteraction(item.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default History;