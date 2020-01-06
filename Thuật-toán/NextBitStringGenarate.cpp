#include<iostream>
using namespace std;

void nextBit(int a[], int n) {
	for (int i = n - 1; i > 0; i--) {
		if (a[i] == 1)
			a[i] = 0;
		else {
			a[i] = 1;
			break;
		}
	}
}

int main() {
	int n;
	cin >> n;
	int *a = new int[n];
	for (int i = 0; i < n; i++)
		cin >> a[i];
	nextBit(a, n);
	for (int i = 0; i < n; i++)
		cout << a[i];
	system("pause");
	return 0;
}