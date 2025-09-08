// Goal-Illa 앱에서 First-Penguins 계정으로 로그인하는 예시
// 나중에 Goal-Illa 앱에 추가할 코드

// Goal-Illa 앱의 로그인 화면에 추가할 버튼
const FirstPenguinsLoginButton = () => {
  const handleFirstPenguinsLogin = async () => {
    try {
      // First-Penguins 계정 정보 입력 받기
      const firstpenguinsUserId = prompt('First-Penguins 아이디를 입력하세요:');
      const firstpenguinsPassword = prompt('First-Penguins 비밀번호를 입력하세요:');
      
      // First-Penguins 백엔드로 연동 로그인 요청
      const response = await fetch('https://firstpenguins-backend.herokuapp.com/api/link/login-with-firstpenguins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstpenguinsUserId,
          firstpenguinsPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Goal-Illa JWT 토큰 저장
        await AsyncStorage.setItem('goalilla_token', result.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(result.user));
        
        // Goal-Illa 앱의 메인 화면으로 이동
        navigation.navigate('Main');
        
        Alert.alert('로그인 성공', 'First-Penguins 계정으로 로그인되었습니다!');
      } else {
        Alert.alert('로그인 실패', result.message);
      }
    } catch (error) {
      console.error('First-Penguins 로그인 오류:', error);
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.firstpenguinsLoginButton}
      onPress={handleFirstPenguinsLogin}
    >
      <Text style={styles.firstpenguinsLoginText}>
        First-Penguins 계정으로 로그인
      </Text>
    </TouchableOpacity>
  );
};

// Goal-Illa 앱의 로그인 화면에 추가할 계정 연동 버튼
const AccountLinkingButton = () => {
  const handleAccountLinking = async () => {
    try {
      // 현재 Goal-Illa 계정 정보
      const goalillaUserId = await AsyncStorage.getItem('goalilla_user_id');
      const goalillaPassword = prompt('Goal-Illa 비밀번호를 입력하세요:');
      
      // First-Penguins 계정 정보
      const firstpenguinsUserId = prompt('연동할 First-Penguins 아이디를 입력하세요:');
      
      // 계정 연동 요청
      const response = await fetch('https://firstpenguins-backend.herokuapp.com/api/link/link-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstpenguinsUserId,
          goalillaUserId,
          goalillaPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        Alert.alert('연동 완료', 'First-Penguins 계정과 연동되었습니다!');
      } else {
        Alert.alert('연동 실패', result.message);
      }
    } catch (error) {
      console.error('계정 연동 오류:', error);
      Alert.alert('오류', '계정 연동 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.accountLinkingButton}
      onPress={handleAccountLinking}
    >
      <Text style={styles.accountLinkingText}>
        First-Penguins 계정과 연동하기
      </Text>
    </TouchableOpacity>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  firstpenguinsLoginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  firstpenguinsLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountLinkingButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  accountLinkingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { FirstPenguinsLoginButton, AccountLinkingButton };
