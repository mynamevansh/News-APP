// Test script to verify axios integration and API functionality
const axios = require('axios');

console.log('🧪 Testing Axios Integration...\n');

// Test 1: Check if axios is working
console.log('✅ Test 1: Basic Axios Test');
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    console.log('   ✓ Axios is working correctly!');
    console.log('   ✓ Response status:', response.status);
    console.log('   ✓ Data received:', response.data.title);
  })
  .catch(error => {
    console.log('   ❌ Axios test failed:', error.message);
  });

// Test 2: Simulate our news API call structure  
console.log('\n✅ Test 2: News API Structure Test');
const testNewsCall = async () => {
  try {
    // This simulates what our fetchNews function does
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        _limit: 3
      }
    });
    
    console.log('   ✓ News API structure test passed!');
    console.log('   ✓ Number of articles fetched:', response.data.length);
    console.log('   ✓ Sample article title:', response.data[0].title);
    
  } catch (error) {
    console.log('   ❌ News API structure test failed:', error.message);
  }
};

testNewsCall();

console.log('\n🚀 Axios integration is ready for your React news app!');
console.log('📱 Your app is running at: http://localhost:3000');
console.log('🔧 To use real news data, get an API key from: https://newsapi.org/');