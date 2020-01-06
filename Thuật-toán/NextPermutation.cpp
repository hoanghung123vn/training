//#include<iostream>
//using namespace std;
//
//void nextPermutation(int n, int a[]) {
//	int j = n - 2;
//	while (a[j] > a[j + 1])
//		j--;
//	int k = n - 1;
//	while (a[k] < a[j])
//		k--;
//	swap(a[j], a[k]);
//	int r = n - 1;
//	int s = j + 1;
//	while (r > s) {
//		swap(a[r], a[s]);
//		r--;
//		s++;
//	}
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++)
//		cin >> a[i];
//	nextPermutation(n, a);
//	for (int i = 0; i < n; i++)
//		cout << a[i];
//	system("pause");
//	return 0;
//}