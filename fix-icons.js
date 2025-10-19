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
    
    // Reemplazar import
    content = content.replace(
      /import Icon from 'react-native-vector-icons\/MaterialIcons';/g,
      "import { MaterialIcons } from '@expo/vector-icons';"
    );
    
    // Reemplazar todas las referencias a Icon
    content = content.replace(/<Icon /g, '<MaterialIcons ');
    content = content.replace(/<\/Icon>/g, '</MaterialIcons>');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

console.log('All screen files updated!');
