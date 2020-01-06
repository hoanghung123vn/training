//#include<iostream>
//using namespace std;
//
//int C(int n, int k, int **D) {
//	if (k == 0 || k == n) return 1;
//	for (int i = 0; i < n; i++) {
//		D[n][0] = 1;
//		for (int j = 1; j < k; j++) D[i, j] = 0;
//	}
//	if (D[n][k] > 0) return D[n][k];
//	else {
//		D[n][k] = C(n - 1, k, D) + C(n - 1, k - 1, D);
//		return D[n][k];
//	}
//}
//
//int main() {
//	int n, k;
//	cin >> k >> n;
//	int **D = new int *[n];
//
//	for (int i = 0; i < n; i++) D[i] = new int[k];
//
//	cin >> k >> n;
//	cout << C(n, k, D) << endl;
//
//	for (int i = 0; i < n; i++) delete[] D[i];
//	delete[] D;
//
//	system("pause");
//	return 0;
//}