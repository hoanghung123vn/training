//#include<iostream>
//
//using namespace std;
//
//void merge(int low, int mid, int hight, int a[], int n) {
//	int *A = new int[n]; // luon phai tao 1 mang phu co kich thuoc bang mang a ban dau hoac 2 mang phu
//	for (int i = low; i <= hight; i++) A[i] = a[i];
//	int i = low;
//	int j = mid + 1;
//	int k;
//	//merge
//	for (k = low; (i <= mid) && (j <= hight); k++) {
//		if (A[i] < A[j]) {
//			a[k] = A[i];
//			i++;
//		}
//		else {
//			a[k] = A[j];
//			j++;
//		}
//	}
//	for (; i <= mid; i++, k++) a[k] = A[i]; // sao not mang ben trai
//	for (; j <= hight; j++, k++) a[k] = A[j]; // sao not mang ben phai
//}
//
//void mergeSort(int low, int hight, int a[], int n) {
//	if (low < hight) {
//		int mid = (low + hight) / 2;
//		mergeSort(low, mid, a, n);
//		mergeSort(mid + 1, hight, a, n);
//		merge(low, mid, hight, a, n);
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
//	mergeSort(0, n - 1, a, n);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}