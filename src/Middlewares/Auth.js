export const adminAuth = (req, res, next) => {
  const token = "xyz";
  const validToken = token === "xyz";

  if (!validToken) {
    console.error("Unauthorized access attempt.");
    return res.status(404).send("Access denied. Admin only.");
  } 
    next();
    console.log("Admin authorizeD.");
  
};
export const userAuth = (req, res, next) => {
  const token = "abc";
  const validToken = token === "abc";

  if (!validToken) {
    console.error("Unauthorized access attempt.");
    return res.status(404).send("Access denied. Admin only.");
  } 
    next();
    console.log("Admin authorizeD.");
  
};