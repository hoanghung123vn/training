//#include<iostream>
//using namespace std;
//#define INFINITY 1000000000
//int n, k, f, fopt, cmin;
//int **c;
//int *x;
//int *v;
//void branch(int k) {
//	for (int i = 1; i <= n; i++) {
//		if (v[i] == 0) {
//			x[k] = i;
//			v[i] = 1;
//			f = f + c[x[k - 1]][x[k]];
//			if (k == n) {
//				int temp = f + c[x[k]][0];
//				if (temp < fopt)
//					fopt = temp;
//			}
//			else {
//				int g = f + (n - k + 1) * cmin;
//				if (g < fopt)
//					branch(k + 1);
//			}
//			v[i] = 0;
//			f = f - c[x[k - 1]][x[k]];
//		}
//	}
//}
//
//int main() {
//	cmin = INFINITY;
//	cin >> n;
//	c = new int *[n + 1];
//	for (int i = 0; i <= n; i++) 
//		c[i] = new int[n + 1];
//	for (int i = 0; i <= n; i++) {
//		for (int j = 0; j <= n; j++) {
//			cin >> c[i][j];
//			if (c[i][j] < cmin)
//				cmin = c[i][j];
//		}
//		v[i] = 0;
//	}
//	fopt = INFINITY;
//	f = 0;
//	x = new int[n + 1];
//	v[0] = 1;
//	branch(1);
//	for (int i = 0; i <= n; i++)
//		delete[] c[i];
//	delete[] c;
//	system("pause");
//	return 0;
//}