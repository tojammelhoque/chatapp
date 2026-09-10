export async function checkAuth(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json(req.user || { message: "Authorized" });
  } catch (error) {}
}
