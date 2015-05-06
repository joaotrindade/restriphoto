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
        StreamWriter file;
        TcpClient tcpClient;
        IPAddress ipAddress;
        NetworkStream stream;
        StreamReader inStream;
        StreamWriter outStream;

        public DailyTask()
        {
            file = new System.IO.StreamWriter("G:/logs.txt");
            tcpClient = new TcpClient();
            ipAddress = IPAddress.Parse("127.0.0.1");
            tcpClient.Connect(ipAddress, 60070);
            stream = tcpClient.GetStream();
            inStream = new StreamReader(stream);
            outStream = new StreamWriter(stream);

        }

        public int cleanData()
        {
            //estado_tempo(Local,E1,E2,E3,E4,E5)
            writeSocket("clean_data.");
            return responseOK();
        }

        public int sendWeather() // Remover futuramente
        {
            writeSocket("estado_tempo(\"coimbra\", 10, 12, 14, 30, 30).");
            return responseOK();
        }


        //Recebe local e array de tamanho 5 com o estado do tempo dos 5 dias seguintes
        public int sendWeather(String local, int[] estadoTempo)
        {
            String message = "estado_tempo(\"";
            message += local;
            message += "\", ";
            for (int k = 0; k < 4; k++)
            {
                message += estadoTempo[k];
                message += ",";
            }

            message += estadoTempo[4];
            message += ").";
            writeSocket(message);
            return responseOK();
        }

        public int sendSea() // Remover futuramente
        {
            //estado_mares(Porto,E1,E2,E3,E4,E5,E6,E7,E8,E9,E10) E's são horas. Preia-mar/BaixaMar. Recebe um porto e nao uma cidade
            writeSocket("estado_mares(\"leixoes\", 10, 12, 10, 12, 10, 12, 10, 12,10, 12).");
            return responseOK();
        }

        //Recebe local e array de tamanho 10 com as horas das mares dos 5 dias seguintes. no formato: [preia_mar1,baixa_mar1,preia_mar2,baixa_mar2, ..., preia_mar5, baixa_mar5]
        public int sendSea(String porto, int[] horasMares)
        {
            String message = "estado_mares(\"";
            message += porto;
            message += "\", ";
            for (int k = 0; k < 9; k++)
            {
                message += horasMares[k];
                message += ",";
            }

            message += horasMares[9];
            message += ").";
            writeSocket(message);
            return responseOK();
        }

        public int sendAstro() // Remover futuramente
        {
            //estado_astro(Local,H1,H2,H3,H4,H5,H6,H7,H8,H9,H10)
            writeSocket("estado_astro(\"coimbra\", 18, 18, 18, 18, 18, 18, 18, 18, 18, 18).");
            return responseOK();
        }

        public int sendAstro(String local, int[] horasAstro)
        {
            String message = "estado_astro(\"";
            message += local;
            message += "\", ";
            for (int k = 0; k < 9; k++)
            {
                message += horasAstro[k];
                message += ",";
            }

            message += horasAstro[9];
            message += ").";
            writeSocket(message);
            return responseOK();

        }

        public void queryCoimbra() // Remover futuramente
        {
            //estado_tempo(Local,E1,E2,E3,E4,E5)
            writeSocket("get_tempo(\"coimbra\").");
        }

        public int[] queryPLOG(String local, String porto, int horaInicial, int horaFinal, int[] disponibilidade, int condicaoSunrise, int condicaoSunset, int condicaoAtmosferica, int condicaoMar)
        {
            String message = "request(\"";
            message += local;
            message += "\", \"";
            message += porto;
            message += "\",";
            message += horaInicial + "," + horaFinal + ",";
            for (int k = 0; k < 4; k++)
            {
                message += disponibilidade[k];
                message += ",";
            }
            message += disponibilidade[4] + ",";
            message += condicaoSunrise + "," + condicaoSunset + "," ;
            message += condicaoAtmosferica + "," + condicaoMar;
            message += ").";

            writeSocket(message);
            return parsePLOGArray(readSocket());


        }

        public void writeSocket(String message)
        {
            outStream.WriteLine(message); outStream.Flush();
            file.WriteLine(" < " + message); file.Flush();
        }

        public int responseOK()
        {
            String response = readSocket();
            if (response == "OK.") return 0;
            return 1;
        }

        public String readSocket()
        {
            String tempString = null;
            char[] charArr = new char[256];
            char[] result = new char[256];
            int i = 0;
            while (true)
            {
                inStream.Read(charArr, 0, 1);
                if (charArr[0] == '\n') break;
                else
                {
                    result[i] = charArr[0];
                    i++;
                }
            }
            tempString = new string(result, 0, i);
            file.WriteLine(" > " + tempString); file.Flush();
            return tempString;
        }

        public void Execute()
        {

            //parsePLOGArray("[1,2,3,4,5]");
            
            /* TEST VALUES */

            int[] disponibilidade = new int[5] {1,1,1,1,1};
            int[] estadoATM = new int[5] {10,11,12,12,14};
            int[] estadoMares = new int[10] { 7, 18, 7, 18, 7, 18, 7, 18, 7, 18};
            int[] estadoAstro = new int[10] { 6, 17, 6, 17, 6, 17, 6, 17, 6, 17};
            int[] result;
            cleanData();
            sendWeather("coimbra",estadoATM);
            sendSea("leixoes",estadoMares);
            sendAstro("coimbra", estadoAstro);

            result = queryPLOG("coimbra", "leixoes", 17, 20, disponibilidade, 0, 1, 12, 0);

            for (int i = 0; i < result.Length; i++)
                file.Write(result[i] + " ");
            file.Flush();
            
            //RESULT: 4,3

           /* TEST VALUES */


        }

        public int[] parsePLOGArray (String message)
        {
            int[] result = new int[100];
            int found = 0, temp;
            String partial = "";
            for (int i = 1; i < message.Length; i++ )
            {
                if (message[i] == ',' || message[i] == ']') 
                {
                    temp = Convert.ToInt32(partial);
                    result[found] = temp;
                    found++;
                    partial = "";
                }
                else
                {
                    partial += message[i];
                }
            }
            Array.Resize(ref result, found);
            return result;
        }

    }

}