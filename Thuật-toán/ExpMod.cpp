//#include<iostream>
//using namespace std;
//int main() {
//	int R, C;
//	cout << "Nhap so hang va cot" << endl;
//	cin >> R >> C;
//	//Cach 1
//	int *A = new int[R*C];
//	for (int i = 0; i < R; i++) {
//		for (int j = 0; j < C; j++) {
//			cout << "Nhap vao phan tu A[" << i << "]" << "[" << j << "]" << ":";
//			cin >> A[i*C + j];
//		}	
//	}
//	cout << "Danh sach mang da nhap la" << endl;
//	for (int i = 0; i < R; i++) {
//		for (int j = 0; j < C; j++) {
//			cout << A[i*C + j] << "  ";
//		}
//		cout << endl;
//	}
//	delete[] A;
//	//Cach 2
//	 int **A = new int *[R];
//	for (int i = 0; i < R; i++) A[i] = new int[C];
//	for (int i = 0; i < R; i++) {
//		for (int j = 0; j < C; j++) {
//			cout << "Nhap vao phan tu A[" << i << "]" << "[" << j << "]" << ":";
//			cin >> A[i][j];
//		}
//	}
//	cout << "Danh sach mang da nhap la" << endl;
//	for (int i = 0; i < R; i++) {
//		for (int j = 0; j < C; j++) {
//			cout << A[i][j] << "  ";
//		}
//		cout << endl;
//	}
//	for (int i = 0; i < R; i++) delete[] A[i];
//	delete[] A;
//	int *p = new int[4];
//	p[1] = 2;
//	cout << p[1];
//	delete[] p;
//	system("pause");
//	return 0;
//}