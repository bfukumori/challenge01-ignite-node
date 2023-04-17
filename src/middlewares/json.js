export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buffers).toString();

  try {
    req.body = JSON.parse(fullStreamContent);
  } catch (error) {
    req.body = null;
  }
  res.setHeader('Content-type', 'application/json');
}
