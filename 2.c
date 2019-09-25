#include<stdio.h>
int main()
{
  int month_day(int year, int yearday, int *pmonth, int *pday);
  int *a,*b;
  month_day(2011,1,*a,*b);
  printf("%d,%d\n",a,b);
  return 0;
}
int month_day(int year, int yearday, int *pmonth, int *pday)
  {
   int s[12]={31,28,31,30,31,30,31,31,30,31,30,31},m;
   if(year%4==0&&year%100!=0||year%400==0)
     {s[1]=29;}

    {for(m=0;yearday-s[m]>=0&&m<=10;m++)
             yearday-=s[m];
             if(yearday==0){m-=1;yearday=s[m];}
                   *pmonth=m+1;
                   *pday=yearday;
    }
   return;
  }
