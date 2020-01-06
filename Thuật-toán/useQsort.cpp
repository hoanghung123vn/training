//#include<iostream>
//using namespace std;
//
//int compare(const void *a, const void *b) {
//	const int *x = (int*)a;
//	const int *y = (int*)b;
//	if (*x > * y) return 1;
//	else if (*x < *y) return -1;
//	else return 0;
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	qsort(a, n, sizeof(int), compare);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}