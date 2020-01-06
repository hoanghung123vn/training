//#include<iostream>
//using namespace std;
//
//void partition(float a[], int l, int r, int &i, int &j)
//{
//	i = l - 1, j = r;
//	int p = l - 1, q = r;
//	float v = a[r];
//
//	while (true)
//	{
//		// From left, find the first element greater than 
//		// or equal to v. This loop will definitely terminate 
//		// as v is last element 
//		while (a[++i] < v);
//
//		// From right, find the first element smaller than or 
//		// equal to v 
//		while (v < a[--j])
//			if (j == l)
//				break;
//
//		// If i and j cross, then we are done 
//		if (i >= j) break;
//
//		// Swap, so that smaller goes on left greater goes on right 
//		swap(a[i], a[j]);
//
//		// Move all same left occurrence of pivot to beginning of 
//		// array and keep count using p 
//		if (a[i] == v)
//		{
//			p++;
//			swap(a[p], a[i]);
//		}
//
//		// Move all same right occurrence of pivot to end of array 
//		// and keep count using q 
//		if (a[j] == v)
//		{
//			q--;
//			swap(a[j], a[q]);
//		}
//	}
//
//	// Move pivot element to its correct index 
//	swap(a[i], a[r]);
//
//	// Move all left same occurrences from beginning 
//	// to adjacent to arr[i] 
//	j = i - 1;
//	for (int k = l; k < p; k++, j--)
//		swap(a[k], a[j]);
//
//	// Move all right same occurrences from end 
//	// to adjacent to arr[i] 
//	i = i + 1;
//	for (int k = r - 1; k > q; k--, i++)
//		swap(a[i], a[k]);
//}
//
//// 3-way partition based quick sort 
//void quicksort(float a[], int l, int r)
//{
//	if (r <= l) return;
//
//	int i, j;
//
//	// Note that i and j are passed as reference 
//	partition(a, l, r, i, j);
//
//	// Recur 
//	quicksort(a, l, j);
//	quicksort(a, i, r);
//}
//
//int main() {
//	int n;
//	cin >> n;
//	float *a = new float[n];
//	for (int i = 0; i < n; i++) {
//		cin >> a[i];
//	}
//	quicksort(a, 0, n - 1);
//	for (int i = 0; i < n; i++) {
//		cout << a[i] << " ";
//	}
//	system("pause");
//	return 0;
//}