//#include<iostream>
//using namespace std;
//
//long findMax(int n, int a[]) {
//	long maxSum = 0;
//	for (int i = 0; i < n; i++) {
//		long sum = 0;
//		for (int j = i; j < n; j++) {
//			sum += a[j];
//			if (sum > maxSum) maxSum = sum;
//		}
//	}
//	return maxSum;
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	cout << findMax(n, a);
//	system("pause");
//	return 0;
//}