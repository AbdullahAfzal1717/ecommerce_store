
export const downloadCSV = (data, headers, fileName) => {
    // Combine headers and data rows
    const csvContent = headers.join(",") + "\n" + data.map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };