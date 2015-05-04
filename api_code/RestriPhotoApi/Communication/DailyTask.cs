using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using FluentScheduler;
using RestriPhotoApi.Controllers;

namespace RestriPhotoApi.Communication
{
    public class DailyTask : ITask
    {

        public string s;

        public void Execute()
        {
            StreamWriter file = new System.IO.StreamWriter("F:/logs.txt");
            file.WriteLine("writeln funfa");
            file.Flush();
            //create thread
            TcpClient tcpClient = new TcpClient();
            
            IPAddress ipAddress = IPAddress.Parse("127.0.0.1");
            tcpClient.Connect(ipAddress, 60070);
            NetworkStream stream = tcpClient.GetStream();
            StreamReader inStream = new StreamReader(stream);
            StreamWriter outStream = new StreamWriter(stream);
            
            
            while (true)
            {
                Thread.Sleep(10);
                byte[] bytes = new byte[256];
                char[] charArr = new char[256];
                char[] result = new char[256];
                int i = 0;
                String tempString = null;
                stream = tcpClient.GetStream();
                file.WriteLine("got stream"); file.Flush();

                outStream.WriteLine("comando(1,2).\n");
                outStream.Flush();

                file.WriteLine("wrote"); file.Flush();

                while(true)
                {
                    inStream.Read(charArr, 0, 1);
                    if (charArr[0] == '\n') break;
                    else
                    {
                        file.WriteLine("i:"); file.Flush();
                        file.WriteLine(i); file.Flush();
                        file.WriteLine("content:"); file.Flush();
                        file.WriteLine(charArr[0]); file.Flush();
                        result[i] = charArr[0];
                        i++;
                    }
                }
                //result[i] = '\0';
                tempString = new string(result, 0, i);
                
                
                file.WriteLine("got reply"); file.Flush();
                file.WriteLine(tempString); file.Flush();
                file.WriteLine(tempString.Length); file.Flush();

                break;
            }
            
            file.Close();
        }

        static byte[] GetBytes(string str)
        {
            byte[] bytes = new byte[str.Length * sizeof(char)];
            System.Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        static string GetString(byte[] bytes)
        {
            char[] chars = new char[bytes.Length / sizeof(char)];
            System.Buffer.BlockCopy(bytes, 0, chars, 0, bytes.Length);
            return new string(chars);
        }

    }

}