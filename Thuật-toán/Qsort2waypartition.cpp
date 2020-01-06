//#include<iostream>
//
//using namespace std;
//
//void swap(int &a, int &b) {
//	int tmp = a;
//	a = b;
//	b = tmp;
//}
//
//int partition(int a[], int left, int right) { // phan doan
//	int pivot = left; // chon phan tu chot
//	int i = left;
//	int j = right + 1;
//	while (true) {
//		for (i = i + 1; i <= right; i++) { // duyet tu dau mang
//			if (a[i] >= a[pivot]) break;
//		}
//
//		for (j = j - 1; j >= left; j--) { // duyet tu cuoi mang
//			if (a[j] <= a[pivot]) break;
//		}
//		if (i >= j) break;
//		swap(a[i], a[j]);
//	}
//	swap(a[pivot], a[j]);
//	pivot = j;
//	return pivot;
//}
//
//void quickSort(int a[], int left, int right) {
//	if (left < right) {
//		int pivot = partition(a, left, right);
//		quickSort(a, left, pivot - 1);
//		quickSort(a, pivot + 1, right);
//	}
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	quickSort(a, 0, n - 1);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}