//#include<iostream>
//#include<stack>
//using namespace std;
//#define ll long long int
//
//stack<int> decToBinary(ll n) {
//	stack<int> s;
//	while (n > 0) {
//		s.push(n % 2);
//		n = n / 2;
//	}
//	return s;
//}
//
//ll mul2Mod(ll a, ll b, ll m) {
//	stack <int> s = decToBinary(b);
//	ll result = 0;
//	while (!s.empty()) {
//		ll subResult = a;
//		if (s.top() == 1) {
//			for (ll i = 1; i <= (s.size() - 1); i++)
//				subResult = (subResult * 2) % m;
//			result = (result + subResult) % m;
//		}	
//		s.pop();
//	}
//	return result;
//}
//
//ll expMod(ll a, ll b, ll m) {
//	ll result = 1;
//	while (b > 0) {
//		if (b & 1)
//			result = result * a % m;
//		b = b / 2;
//		a = a * a % m;
//	}
//	return result;
//}
//
//ll mulContinousMod(ll a, ll b, ll m) {
//	ll result = 1;
//	for (ll i = b; i <= a; i++) {
//		result = mul2Mod(result, i, m) % m;
//	}
//	return result;
//}
//
//ll CKN(ll n, ll k, ll m) {
//	ll a = mulContinousMod(n, n - k + 1, m);
//	ll b = mulContinousMod(k, 1, m);
//	ll c = expMod(b, m - 2, m);
//	return mul2Mod(a, c, m);
//}
//
//int main() {
//	ll l;
//	cin >> l;
//	ll *a = new ll[l];
//	for (ll i = 0; i < l; i++) {
//		ll n, k, m;
//		cin >> n >> k >> m;
//		a[i] = CKN(n, k, m);
//	}
//	for (ll i = 0; i < l; i++)
//		cout << a[i] << endl;
//	system("pause");
//	return 0;
//}