import React, { useEffect } from 'react';

export default function TestComponent() {
  console.log('🧪 TestComponent: Component function started');
  
  useEffect(() => {
    console.log('🧪 TestComponent: useEffect executed');
    return () => {
      console.log('🧪 TestComponent: useEffect cleanup');
    };
  }, []);

  console.log('🧪 TestComponent: About to render');
  return <div>Test Component</div>;
}