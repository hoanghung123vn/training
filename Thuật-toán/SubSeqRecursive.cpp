//#include<iostream>
//#include<algorithm>
//using namespace std;
//
//long findMaxCrossMidPoint(int a[], int l, int m, int h) {
//	int maxSumLeft = INT_MIN, sum = 0;
//	for (int i = m; i >= l; i--) {
//		sum += a[i];
//		if (sum > maxSumLeft) maxSumLeft = sum;
//	}
//	int maxSumRight = INT_MIN;
//	sum = 0;
//	for (int i = m + 1; i <= h; i++) {
//		sum += a[i];
//		if (sum > maxSumRight) maxSumRight = sum;
//	}
//	return maxSumLeft + maxSumRight;
//}
//
//long findMax(int a[], int l, int h) {
//	if (l == h) return a[l];
//	else {
//		int m = (l + h) / 2;
//		int wL = findMax(a, l, m);
//		int wR = findMax(a, m + 1, h);
//		int wM = findMaxCrossMidPoint(a, l, m, h);
//		return max(max(wL, wR), wM);
//	}
//}
//int main() {
//	int n;
//	cin >> n;
//	int *a = new int[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	cout << findMax(a, 0, n - 1);
//	system("pause");
//	return 0;
//}