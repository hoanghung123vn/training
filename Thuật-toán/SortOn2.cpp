//#include <iostream>
//using namespace std;
//
//void swap(int &a, int &b) {
//	int tmp = a;
//	a = b;
//	b = tmp;
//}
//
// void selectionSort(int n, int a[]){
//     for(int i = 0; i < n; i++){
//         for(int j = i + 1; j < n; j++){
//             if(a[j] < a[i]) swap(a[i], a[j]);
//         }
//     }
// }

// void insertSort(int n, int a[]){
//     for (int i = 0; i < n; i++) {
//         for (int j = i+ 1; j > 0; j--) {
//             if(a[j] < a[j-1]){
//                 swap(a[j], a[j-1]);
//             } else break;
//         }
//     }
// }
//
//void bubbleSort(int n, int a[]) {
//	for (int i = 0; i < n; i++) {
//		int count = 0;
//		for (int j = 0; j < n - i - 1; j++) {
//			if (a[j] > a[j + 1]) {
//				swap(a[j], a[j + 1]);
//				count++;
//			}
//		}
//		if (!count) break;
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
//	bubbleSort(n, a);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	delete[] a;
//	system("pause");
//	return 0;
//}