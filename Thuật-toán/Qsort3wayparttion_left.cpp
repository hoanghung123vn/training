//#include<iostream>
//using namespace std;
//
//void quickSort3way_left(int a[], int left, int right) {
//	if (left < right) {
//		int pivot = a[left];
//		int p = left + 1, q = right;
//		int i = p - 1, j = q + 1;//phase 1                    pivot
//		while (true) {//                                        |-----|----------------------------------|
//			          //                                       left p  i                             j  q right
//			while (a[++i] < pivot) {
//				if (i == right) break;
//			}
//			while (a[--j] > pivot) {
//				if (j == left) break;// bo dong nay cung duoc ?
//			}
//			if (i >= j) break;
//			swap(a[i], a[j]);
//			if (a[i] == pivot) swap(a[p++], a[i]);
//			if (a[j] == pivot) swap(a[q--], a[j]);//end phase 1        |--------|-------------||-------------|--------|
//		}//                                                            = pivot  p   < pivot  j i   >pivot    q   =pivot
//		//phase 2
//		for (p = p - 1; p >= left; p--, j--) swap(a[p], a[j]);
//		for (q = q + 1; q <= right; q++, i++) swap(a[q], a[i]);//      |---------------|--------------|-------------|
//		quickSort3way_left(a, left, j);//                          left    < pivot     j   = pivot   i   > pivot   right
//		quickSort3way_left(a, i, right);
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
//	quickSort3way_left(a, 0, n - 1);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}