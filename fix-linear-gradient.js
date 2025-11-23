const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');

// Lista de archivos de pantallas
const screenFiles = [
  'LoginScreen.tsx',
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
    
    // Reemplazar import de LinearGradient
    content = content.replace(
      /import LinearGradient from 'react-native-linear-gradient';/g,
      "import { LinearGradient } from 'expo-linear-gradient';"
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

console.log('All LinearGradient imports updated!');
