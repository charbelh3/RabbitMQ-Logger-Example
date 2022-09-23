const amqp = require("amqplib");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange("logExchange", "direct");

  const q = await channel.assertQueue("WarningAndErrorsQueue");

  await channel.bindQueue(q.queue, "logExchange", "Warning");
  await channel.bindQueue(q.queue, "logExchange", "Error");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}

consumeMessages();
