//#include<iostream>
//using namespace std;
//long findMax(int n, int a[]) {
//	long max = a[0];
//	int* s = NULL;
//	s = new int[n];
//	s[0] = a[0];
//	max = s[0];
//	for (int i = 1; i < n; i++) {
//		if (s[i - 1] > 0) s[i] = s[i - 1] + a[i];
//		else s[i] = a[i];
//		max = max > s[i] ? max : s[i];
//	}
//	return max;
//}
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