// Test real NewsAPI integration
const axios = require('axios');

const API_KEY = '7832e0edab2d4bb8936ab87605a4e608';
const API_BASE_URL = 'https://newsapi.org/v2';

console.log('🧪 Testing Real NewsAPI Integration...\n');

const testRealNewsAPI = async () => {
  try {
    console.log('✅ Testing real NewsAPI with your key...');
    
    const response = await axios.get(`${API_BASE_URL}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country: 'us',
        pageSize: 5
      }
    });
    
    if (response.data.status === 'ok') {
      console.log('   ✅ SUCCESS! Real news API is working!');
      console.log(`   ✅ Total articles available: ${response.data.totalResults}`);
      console.log(`   ✅ Fetched ${response.data.articles.length} articles`);
      console.log('   ✅ Sample headlines:');
      
      response.data.articles.slice(0, 3).forEach((article, index) => {
        console.log(`      ${index + 1}. ${article.title}`);
        console.log(`         Source: ${article.source.name}`);
      });
      
      console.log('\n🎉 Your news app should now show REAL news data!');
      console.log('🌐 Open http://localhost:3000 to see live news!');
    }
    
  } catch (error) {
    console.log('   ❌ API Error:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.log('   🔑 API Key issue - check if your key is valid');
    } else if (error.response?.status === 429) {
      console.log('   ⏱️  Rate limit exceeded - try again later');
    }
  }
};

testRealNewsAPI();