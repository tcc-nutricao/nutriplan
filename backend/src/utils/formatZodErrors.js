export function formatZodErrors(err) {
  return err.errors.reduce((acc, curr) => {
    const field = curr.path[0];
    if (!acc[field]) acc[field] = curr.message;
    return acc;
  }, {});
}
