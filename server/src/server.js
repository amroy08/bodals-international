const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 BODAL'S INTERNATIONAL Backend`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   API base: http://localhost:${PORT}/api`);
  console.log(`   Uploads: http://localhost:${PORT}/uploads\n`);
});
