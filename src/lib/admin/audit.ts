import { pool } from "@/lib/db";

export async function logAudit(
  admin: { id: string; name: string },
  action: "create" | "update" | "delete",
  resource: string,
  resourceId?: string | number
) {
  await pool.query(
    `INSERT INTO audit_log (admin_id, admin_name, action, resource, resource_id) VALUES ($1, $2, $3, $4, $5)`,
    [admin.id, admin.name, action, resource, resourceId != null ? String(resourceId) : null]
  );
}
