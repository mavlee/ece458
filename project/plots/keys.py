import matplotlib.pyplot as plt
import random

x = range(1,16)
y = [random.random() * 150 for a in range(len(x))]
e1 = [random.random() * 10 + 30 for a in range(len(x))]
e2 = [random.random() * 10 + 30 for a in range(len(x))]

plt.figure()
plt.errorbar(x, y, yerr=[e1,e2], fmt='ro')
plt.xlabel("Letter or Letter Pair")
plt.ylabel("Timing (milliseconds)")
plt.title("Dwell and Flight Time for Sample Password")
plt.xticks(x,('p', 'p-a', 'a', 'a-s', 's', 's-s', 's', 's-w', 'w', 'w-o', 'o', 'o-r', 'r', 'r-d', 'd'))
plt.xlim(0, 16)
plt.show()
