//#include<iostream>
//using namespace std;
//
//void nextCombination(int n, int m, int a[]) {
//	int i = m - 1;
//	while (a[i] == n - m + i + 1)
//		i--;
//	a[i] = a[i] + 1;
//	for (int j = i + 1; j < m; j++)
//		a[j] = a[i] + j - i;
//}
//
//int main() {
//	int n, m;
//	cin >> n >> m;
//	int *a = new int[m];
//	for (int i = 0; i < m; i++)
//		cin >> a[i];
//	nextCombination(n, m, a);
//	for (int i = 0; i < m; i++)
//		cout << a[i];
//	system("pause");
//	return 0;
//}