const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');

// Lista de archivos de pantallas
const screenFiles = [
  'ForgotPasswordScreen.tsx',
  'DashboardScreen.tsx',
  'InventoryScreen.tsx',
  'OrdersScreen.tsx',
  'VisitsScreen.tsx',
  'ReturnsScreen.tsx',
  'NewOrderScreen.tsx'
];

screenFiles.forEach(file => {
  const filePath = path.join(screensDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Agregar GRADIENTS a la importación si no existe
    if (content.includes("import { COLORS") && !content.includes("GRADIENTS")) {
      content = content.replace(
        /import { COLORS, SIZES, FONTS } from '\.\.\/constants';/g,
        "import { COLORS, SIZES, FONTS, GRADIENTS } from '../constants';"
      );
    }
    
    // Reemplazar COLORS.GRADIENTS.primary por GRADIENTS.primary
    content = content.replace(/COLORS\.GRADIENTS\.primary/g, 'GRADIENTS.primary');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

console.log('All gradient references fixed!');
