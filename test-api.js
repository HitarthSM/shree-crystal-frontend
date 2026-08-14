import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testBackend() {
  console.log('--- Starting API E2E Test ---');
  let adminToken = '';
  let memberToken = '';

  try {
    // 1. Admin Login
    console.log('1. Testing Admin Login...');
    const adminRes = await axios.post(`${API_URL}/auth/login`, {
      identifier: 'admin@shreecrystal.local',
      password: 'ChangeMe@2024'
    }, { validateStatus: () => true });

    if (adminRes.status === 200 && adminRes.data.access_token) {
      adminToken = adminRes.data.access_token;
      console.log('✅ Admin Login Successful');
    } else {
      console.log('❌ Admin Login Failed. Status:', adminRes.status);
      console.log('Response:', adminRes.data);
    }

    // 2. Test Admin Dashboard
    if (adminToken) {
      console.log('\n2. Testing Admin Dashboard...');
      const dashRes = await axios.get(`${API_URL}/dashboard/admin`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        validateStatus: () => true
      });
      if (dashRes.status === 200) {
        console.log('✅ Admin Dashboard fetched. Stats:', dashRes.data.stats);
      } else {
        console.log('❌ Admin Dashboard Failed. Status:', dashRes.status);
      }
      
      console.log('\n3. Testing Members List...');
      const membersRes = await axios.get(`${API_URL}/members`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        validateStatus: () => true
      });
      if (membersRes.status === 200) {
        console.log(`✅ Members fetched successfully. Count: ${membersRes.data.meta?.total || 0}`);
        
        // Try to get a member ID to test member login
        if (membersRes.data.data && membersRes.data.data.length > 0) {
          const firstMember = membersRes.data.data[0];
          console.log(`Using member ${firstMember.memberId} for member test.`);
          
          // 4. Member Login
          console.log('\n4. Testing Member Login...');
          const memberRes = await axios.post(`${API_URL}/auth/login/member`, {
            memberId: firstMember.memberId,
            password: 'password123'
          }, { validateStatus: () => true });
          
          if (memberRes.status === 200) {
             memberToken = memberRes.data.access_token;
             console.log('✅ Member Login Successful');
             
             // 5. Member Profile
             console.log('\n5. Testing Member Profile...');
             const profileRes = await axios.get(`${API_URL}/members/me`, {
               headers: { Authorization: `Bearer ${memberToken}` },
               validateStatus: () => true
             });
             
             if (profileRes.status === 200) {
                console.log('✅ Member Profile fetched:', profileRes.data.fullName);
             } else {
                console.log('❌ Member Profile Failed. Status:', profileRes.status);
             }
          } else {
             console.log('❌ Member Login Failed (might not have default password set). Status:', memberRes.status);
          }
        }
      } else {
        console.log('❌ Members fetch Failed. Status:', membersRes.status);
      }
    }
    
  } catch (err) {
    console.error('Test Execution Error:', err.message);
  }
}

testBackend();
