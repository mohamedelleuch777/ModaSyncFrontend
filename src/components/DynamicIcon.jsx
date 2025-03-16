import * as Icons from "react-bootstrap-icons";

const DynamicIcon = ({ iconName, size = 24, color = "black" }) => {
    const IconComponent = Icons[iconName]; // Get the icon dynamically
  
    if (!IconComponent) {
      return <p>Icon not found</p>; // Handle invalid icon names
    }
  
    return <IconComponent size={size} color={color} />;
};


export default DynamicIcon