// ============================================
// Linux Quest — Banco de Preguntas de Linux
// ============================================

export const questions = {
  easy: [
    {
      question: "¿Quién creó el kernel de Linux?",
      options: ["Richard Stallman", "Linus Torvalds", "Dennis Ritchie", "Ken Thompson"],
      correctIndex: 1,
      category: "Historia"
    },
    {
      question: "¿Qué comando se usa para listar archivos en un directorio?",
      options: ["dir", "ls", "list", "show"],
      correctIndex: 1,
      category: "Comandos"
    },
    {
      question: "¿Qué significa 'GNU' en GNU/Linux?",
      options: ["General New Utility", "GNU's Not Unix", "Great New Unix", "Global Network Utility"],
      correctIndex: 1,
      category: "Historia"
    },
    {
      question: "¿Qué comando se usa para cambiar de directorio?",
      options: ["mv", "cd", "ch", "go"],
      correctIndex: 1,
      category: "Comandos"
    },
    {
      question: "¿Cuál es el directorio raíz en Linux?",
      options: ["C:\\", "/", "/root", "/home"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando muestra el directorio actual de trabajo?",
      options: ["whereami", "cwd", "pwd", "dir"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué distribución de Linux es conocida por ser la más amigable para principiantes?",
      options: ["Arch Linux", "Gentoo", "Ubuntu", "Slackware"],
      correctIndex: 2,
      category: "Distribuciones"
    },
    {
      question: "¿Qué comando se usa para copiar archivos?",
      options: ["cp", "copy", "cpy", "duplicate"],
      correctIndex: 0,
      category: "Comandos"
    },
    {
      question: "¿Qué comando se usa para crear un directorio?",
      options: ["newdir", "create", "md", "mkdir"],
      correctIndex: 3,
      category: "Comandos"
    },
    {
      question: "¿Cuál es la mascota oficial de Linux?",
      options: ["Un zorro", "Un pingüino", "Un búho", "Un gato"],
      correctIndex: 1,
      category: "Historia"
    },
    {
      question: "¿Cómo se llama la mascota pingüino de Linux?",
      options: ["Penny", "Tux", "Pingu", "Linux"],
      correctIndex: 1,
      category: "Historia"
    },
    {
      question: "¿Qué comando se usa para mover o renombrar archivos?",
      options: ["rn", "move", "mv", "rename"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué comando se usa para ver el contenido de un archivo?",
      options: ["read", "open", "cat", "view"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué símbolo se usa para redirigir la salida a un archivo?",
      options: ["<", "|", ">>", ">"],
      correctIndex: 3,
      category: "Shell"
    },
    {
      question: "¿Qué comando se usa para borrar archivos?",
      options: ["del", "rm", "erase", "delete"],
      correctIndex: 1,
      category: "Comandos"
    },
    {
      question: "¿En qué año se lanzó la primera versión del kernel Linux?",
      options: ["1989", "1991", "1993", "1995"],
      correctIndex: 1,
      category: "Historia"
    },
    {
      question: "¿Qué comando se usa para limpiar la terminal?",
      options: ["cls", "clean", "clear", "reset"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué directorio contiene los archivos del usuario en Linux?",
      options: ["/usr", "/home", "/var", "/etc"],
      correctIndex: 1,
      category: "Sistema"
    }
  ],
  medium: [
    {
      question: "¿Qué comando muestra los procesos en ejecución?",
      options: ["proc", "ps", "tasks", "top"],
      correctIndex: 1,
      category: "Comandos"
    },
    {
      question: "¿Qué significa el permiso '755' en un archivo?",
      options: ["Solo lectura para todos", "Lectura/escritura para todos", "rwx para dueño, rx para grupo y otros", "Sin permisos"],
      correctIndex: 2,
      category: "Permisos"
    },
    {
      question: "¿Qué comando se usa para cambiar permisos de archivos?",
      options: ["perm", "chmod", "chown", "access"],
      correctIndex: 1,
      category: "Permisos"
    },
    {
      question: "¿Qué archivo contiene la información de usuarios del sistema?",
      options: ["/etc/users", "/etc/passwd", "/etc/accounts", "/var/users"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para buscar archivos en el sistema?",
      options: ["search", "look", "find", "locate"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué es 'apt' en distribuciones basadas en Debian?",
      options: ["Un editor de texto", "Un gestor de paquetes", "Un firewall", "Un compilador"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué significa 'sudo'?",
      options: ["Super User Do", "System Utility Daemon Operation", "Switch User Domain", "Secure User Directory"],
      correctIndex: 0,
      category: "Comandos"
    },
    {
      question: "¿Qué comando se usa para buscar texto dentro de archivos?",
      options: ["find", "search", "grep", "look"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué distribución es la base de Ubuntu?",
      options: ["Red Hat", "Fedora", "Debian", "Arch"],
      correctIndex: 2,
      category: "Distribuciones"
    },
    {
      question: "¿Qué comando muestra el uso de disco de archivos y directorios?",
      options: ["disk", "df", "du", "space"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué es un 'pipe' (|) en la terminal de Linux?",
      options: ["Un operador de asignación", "Conecta la salida de un comando con la entrada de otro", "Un separador de rutas", "Un comentario"],
      correctIndex: 1,
      category: "Shell"
    },
    {
      question: "¿Qué directorio almacena los archivos de configuración del sistema?",
      options: ["/config", "/sys", "/etc", "/settings"],
      correctIndex: 2,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para ver las últimas líneas de un archivo?",
      options: ["end", "last", "bottom", "tail"],
      correctIndex: 3,
      category: "Comandos"
    },
    {
      question: "¿Qué tipo de sistema de archivos es comúnmente usado en Linux?",
      options: ["NTFS", "FAT32", "ext4", "HFS+"],
      correctIndex: 2,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para descargar archivos desde la terminal?",
      options: ["download", "get", "wget", "fetch"],
      correctIndex: 2,
      category: "Comandos"
    },
    {
      question: "¿Qué shell es el más comúnmente usado por defecto en Linux?",
      options: ["zsh", "fish", "bash", "csh"],
      correctIndex: 2,
      category: "Shell"
    },
    {
      question: "¿Qué comando muestra información del sistema operativo?",
      options: ["sysinfo", "uname", "osinfo", "ver"],
      correctIndex: 1,
      category: "Comandos"
    },
    {
      question: "¿Qué gestor de paquetes usa Fedora/Red Hat?",
      options: ["apt", "pacman", "dnf", "zypper"],
      correctIndex: 2,
      category: "Distribuciones"
    }
  ],
  hard: [
    {
      question: "¿Qué syscall usa Linux para crear un nuevo proceso?",
      options: ["spawn()", "create()", "fork()", "exec()"],
      correctIndex: 2,
      category: "Kernel"
    },
    {
      question: "¿Qué archivo especial representa el dispositivo 'null' en Linux?",
      options: ["/dev/zero", "/dev/null", "/dev/void", "/dev/empty"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para compilar código C en Linux?",
      options: ["cc", "gcc", "compile", "build"],
      correctIndex: 1,
      category: "Desarrollo"
    },
    {
      question: "¿Qué es un 'inode' en el sistema de archivos de Linux?",
      options: ["Un tipo de red", "Una estructura que almacena metadatos de archivos", "Un proceso del kernel", "Un tipo de partición"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando muestra las conexiones de red activas?",
      options: ["netstat / ss", "network", "ifconfig", "connections"],
      correctIndex: 0,
      category: "Redes"
    },
    {
      question: "¿Qué es 'systemd' en Linux?",
      options: ["Un editor de texto", "Un sistema de init y gestor de servicios", "Un firewall", "Un gestor de paquetes"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para montar un sistema de archivos?",
      options: ["attach", "mount", "connect", "link"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué significa el permiso 'setuid' (SUID)?",
      options: ["El archivo es inmutable", "Se ejecuta con los permisos del propietario", "Solo root puede acceder", "Es un archivo oculto"],
      correctIndex: 1,
      category: "Permisos"
    },
    {
      question: "¿En qué lenguaje de programación está escrito principalmente el kernel de Linux?",
      options: ["C++", "C", "Rust", "Assembly"],
      correctIndex: 1,
      category: "Kernel"
    },
    {
      question: "¿Qué archivo se usa para configurar las tareas programadas del usuario?",
      options: ["/etc/schedule", "crontab", "/etc/tasks", "systemd-timer"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué comando se usa para ver la tabla de rutas de red?",
      options: ["route / ip route", "netpath", "tracert", "pathinfo"],
      correctIndex: 0,
      category: "Redes"
    },
    {
      question: "¿Qué es LVM en Linux?",
      options: ["Linux Virtual Machine", "Logical Volume Manager", "Local Variable Map", "Linux Version Manager"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué señal envía 'kill -9' a un proceso?",
      options: ["SIGTERM", "SIGINT", "SIGKILL", "SIGHUP"],
      correctIndex: 2,
      category: "Kernel"
    },
    {
      question: "¿Qué directorio contiene los archivos de dispositivos en Linux?",
      options: ["/sys", "/proc", "/dev", "/mnt"],
      correctIndex: 2,
      category: "Sistema"
    },
    {
      question: "¿Qué herramienta se usa para gestionar firewalls en Linux moderno?",
      options: ["firewall-cmd", "iptables / nftables", "ufw solamente", "netfilter"],
      correctIndex: 1,
      category: "Redes"
    },
    {
      question: "¿Qué es SELinux?",
      options: ["Un escritorio gráfico", "Un módulo de seguridad del kernel", "Una distribución de Linux", "Un servidor web"],
      correctIndex: 1,
      category: "Seguridad"
    },
    {
      question: "¿Qué comando muestra información detallada del hardware?",
      options: ["hwinfo", "lshw", "sysinfo", "hardware"],
      correctIndex: 1,
      category: "Sistema"
    },
    {
      question: "¿Qué archivo del sistema contiene los puntos de montaje de particiones?",
      options: ["/etc/partitions", "/etc/fstab", "/etc/mounts", "/proc/disks"],
      correctIndex: 1,
      category: "Sistema"
    }
  ]
};

/**
 * Obtiene preguntas aleatorias sin repetición
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @param {number} count - Cantidad de preguntas
 * @returns {Array} Preguntas seleccionadas
 */
export function getRandomQuestions(difficulty, count) {
  const pool = [...questions[difficulty]];
  const selected = [];

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(randomIndex, 1)[0]);
  }

  return selected;
}

/**
 * Obtiene preguntas mixtas de todas las dificultades
 * @param {string} gameDifficulty - Dificultad del juego para ponderar
 * @param {number} count - Total de preguntas
 * @returns {Array} Preguntas mezcladas
 */
export function getMixedQuestions(gameDifficulty, count) {
  let easyCount, mediumCount, hardCount;

  switch (gameDifficulty) {
    case 'easy':
      easyCount = Math.ceil(count * 0.5);
      mediumCount = Math.ceil(count * 0.35);
      hardCount = count - easyCount - mediumCount;
      break;
    case 'hard':
      easyCount = Math.ceil(count * 0.15);
      mediumCount = Math.ceil(count * 0.35);
      hardCount = count - easyCount - mediumCount;
      break;
    default: // normal
      easyCount = Math.ceil(count * 0.3);
      mediumCount = Math.ceil(count * 0.4);
      hardCount = count - easyCount - mediumCount;
  }

  const mixed = [
    ...getRandomQuestions('easy', easyCount),
    ...getRandomQuestions('medium', mediumCount),
    ...getRandomQuestions('hard', hardCount)
  ];

  // Shuffle
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }

  return mixed;
}
