//#include<iostream>
//#include<algorithm>
//using namespace std;
//
//long findMax(int n, int a[]) {
//	int *s = new int[n];
//	s[0] = a[0];
//	int maxSum = s[0];
//	for (int i = 1; i < n; i++) {
//		s[i] = max(s[i - 1], s[i - 1] + a[i]);
//		maxSum = max(maxSum, s[i]);
//	}
//	return maxSum;
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	cout << findMax(n, a);
//	system("pause");
//	return 0;
//}