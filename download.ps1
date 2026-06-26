$fileId = "14EcwUJ-ywuapLHMDs7V7PMX1lnhWtpl8"
$output = "C:\Users\harsh\OneDrive\Desktop\my new portfolio 2026\Tanishka_Soni_Resume.pdf"

# Try multiple direct download approaches
$urls = @(
    "https://drive.google.com/uc?export=download&id=$fileId&confirm=t",
    "https://drive.google.com/uc?export=download&id=$fileId",
    "https://drive.usercontent.google.com/download?id=$fileId&export=download&confirm=t"
)

foreach ($url in $urls) {
    Write-Output "Trying: $url"
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -MaximumRedirection 10 -UseBasicParsing
        $firstBytes = [System.IO.File]::ReadAllBytes($output)[0..3]
        $header = [System.Text.Encoding]::ASCII.GetString($firstBytes)
        $size = (Get-Item $output).Length
        Write-Output "Header: $header | Size: $size"
        
        if ($header -eq "%PDF") {
            Write-Output "SUCCESS: Valid PDF downloaded!"
            break
        } else {
            Write-Output "Not a PDF, trying next..."
        }
    } catch {
        Write-Output "Error: $_"
    }
}
