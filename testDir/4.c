#include<stdio.h>
#include<math.h>
void main()
{
   int i,x,t=0,m=6,n=7;
   long g=0;
   for(i=1;i<=m;i++)
     {  t=t+i*pow(10,i-1);}
   for(x=m;x<=n;x++)
   { g=g+t;

     t=t+(x+1)*pow(10,x-1);

     }
     printf("%ld",g);
}
