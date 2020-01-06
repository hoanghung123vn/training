//#include<iostream>
//using namespace std;
//
//void heapify(int a[], int i, int n) {
//	int largest = i;
//	int l = 2 * i + 1;
//	int r = 2 * i + 2;
//	if (l < n && a[l] > a[largest]) largest = l;
//	if (r < n && a[r] > a[largest]) largest = r;
//	if (largest != i) {
//		swap(a[i], a[largest]);
//		heapify(a, largest, n);
//	}
//}
//
//void build_max_heap(int a[], int n) {
//	for (int i = n / 2 - 1; i >= 0; i--) {
//		heapify(a, i, n);
//	}
//}
//
//void heapSort(int a[], int n) {
//	build_max_heap(a, n);
//	for (int i = n - 1; i >= 1; i--) {
//		swap(a[0], a[i]);
//		heapify(a, 0, i);
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
//	heapSort(a, n);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}