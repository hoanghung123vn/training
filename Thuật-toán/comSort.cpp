//#include<iostream>
//#include<iomanip>
//using namespace std;
//
//void combSort(float a[], int n) {
//	int gap = n;
//	float shink = 1.3;
//	bool sorted = false;
//	while (sorted == false || gap > 1) {
//		gap = (int)gap / shink;
//		if (gap < 1) gap = 1;
//		if (gap == 1) sorted = true;
//		for (int i = 0; i < n - gap; i++) {
//			if (a[i] > a[i + gap]) {
//				swap(a[i], a[i + gap]);
//				sorted = false;
//			}
//		}
//	}
//}
//
//int main() {
//	int n;
//	cin >> n;
//	float *a = new float[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	combSort(a, n);
//	for (int i = 0; i < n; i++) {
//		cout << setprecision(3) << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}